import { isArray } from "util";
import * as knex from "knex";

interface IAdminQuery {
  from?: number;
  to?: number;
  sortby?: string;
  sortway?: string;
}

export function ParseAdminQuery(input: any) {
  const res: IAdminQuery = {};
  if (input.range) {
    const range = JSON.parse(input.range);
    if (range.length === 2) {
      res.from = range[0];
      res.to = range[1];
    }
  }

  if (input.sort) {
    const sort = JSON.parse(input.sort);
    const sortvalue = sort[0][0].toUpperCase() + (sort[0] as string).substring(1);
    res.sortby = sortvalue;
    res.sortway = sort[1];
  }

  return res;
}

function valueCleanup(value: any) {
  if (value === false) {
    value = 0;
  }
  else if (value === true) {
    value = 1;
  }
  return value;
}

export function ConvertAdminQuery(input: any, query: knex.QueryBuilder) {
  if (input.range) {
    const range = JSON.parse(input.range);
    if (range.length === 2) {
      const amount = range[1] - range[0] + 1;
      query.offset(range[0]);
      query.limit(amount);
    }
  }
  if (input.filter) {
    const obj = JSON.parse(input.filter);

    if (Object.keys(obj).length > 0) {
      const filters = Object.entries(obj);

      for (const filter of filters) {
        const key = filter[0][0].toUpperCase() + (filter[0] as string).substring(1);

        if (isArray(filter[1])) {
          for (let value of filter[1]) {
            value = valueCleanup(value);
            query = query.orWhere(key, value);
          }
        }
        else {
          const value = valueCleanup(filter[1]);
          query = query.andWhere(key, "LIKE", "%" + value + "%");
        }
      }
    }
  }
  if (input.sort) {
    const sort = JSON.parse(input.sort);
    const sortvalue = sort[0][0].toUpperCase() + (sort[0] as string).substring(1);

    query.orderBy(sortvalue, sort[1]);
  }

  // console.log(query.toSQL());
  return query;
}
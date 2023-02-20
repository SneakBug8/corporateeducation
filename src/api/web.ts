import * as express from "express";
import * as bodyParser from "body-parser";
import { Config } from "../config";
import * as ejs from "ejs";
import * as cookieParser from "cookie-parser";

class WebApiClass {
  public app: express.Express;
  public constructor() {
    this.app = express();
    const port = Config.port();

    this.app.set("view engine", "ejs");
    this.app.set("views", Config.projectPath() + "/views");

    this.app.use(express.static(Config.projectPath() + "/public"));

    // app.use(cookieParser());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());

    this.app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });

    this.app.use((req, res, next) => {
      console.log(req.method + " to " + req.url);
      next();
    });

    this.app.use((req, res, next) => {
      if (req.url.startsWith("/api")) {
        res.header("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
        res.setHeader("Access-Control-Allow-Headers", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Expose-Headers", "*");
        next();
        return;
      }
      if (!req.cookies || !req.cookies.password) {
        res.render("login", { err: "" });
      }
      else if (req.cookies.password !== Config.Password) {
        res.render("login", {
          err: "Wrong password"
        });
      }
      else {
        next();
      }
    });

    this.app.get("/", (req, res) => {
      res.render("index");
    });
  }
}

export const WebApi = new WebApiClass();

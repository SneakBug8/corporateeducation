import * as assert from "assert";
import "mocha";
import { AuthService } from "../../users/AuthService";
import { User } from "../../users/User";
import { UserRepository } from "../../users/repositories/UserRepository";

describe("Users", () =>
{
    it("GetByIdDummy", async () =>
    {
        await UserRepository.GetById(0);
        // assert.ok(1 > 0, "Traded goods")
    });

    it("GetByLoginDummy", async () =>
    {
        await UserRepository.GetByLogin("");
        // assert.ok(1 > 0, "Traded goods")
    });

    it("GetAllDummy", async () =>
    {
        await UserRepository.GetAll();
        // assert.ok(1 > 0, "Traded goods")
    });
});

let id = 0;
const login = "test" + Math.round(Math.random() * 100);
const passwold = "test" + Math.round(Math.random() * 100);
const passwnew = "test2" + Math.round(Math.random() * 100);

describe("Auth", () =>
{
    it("CreateUser", async () =>
    {
        const user = new User();
        user.username = login;
        user.password = passwold;

        const userentry = await UserRepository.Insert(user);
        assert.ok(userentry.id, "User should have id");

        if (userentry.id) {
            id = userentry.id;
        }
    });

    it("FindUser", async () =>
    {
        const user = await UserRepository.GetByLogin(login);

        assert.ok(user, "User not found by login");
    });

    it("UpdateUser", async () =>
    {
        const user = await UserRepository.GetById(id);

        if (!user) {
            throw new Error("No error we've just created");
        }
        user.password = passwnew;

        await UserRepository.Update(user);

        const user2 = await UserRepository.GetById(id);

        assert.ok(user2?.password === passwnew, "Password was updated");
    });

    it("AuthUser", async () =>
    {
        const auth = await AuthService.TryAuthWeb(login, passwnew);

        assert.ok(auth, "Authenticated is true");
    });

    it("DeleteUser", async () =>
    {
        await UserRepository.Delete(id);
    });
});
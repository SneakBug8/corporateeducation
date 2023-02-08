import * as assert from "assert";
import "mocha";
import { AuthService } from "../../users/AuthService";
import { User } from "../../users/User";

describe("Users", () =>
{
    it("GetByIdDummy", async () =>
    {
        await User.GetById(0);
        // assert.ok(1 > 0, "Traded goods")
    });

    it("GetByLoginDummy", async () =>
    {
        await User.GetByLogin("");
        // assert.ok(1 > 0, "Traded goods")
    });

    it("GetAllDummy", async () =>
    {
        await User.GetAll();
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

        id = await User.Insert(user);
    });

    it("FindUser", async () =>
    {
        const user = await User.GetByLogin(login);

        assert.ok(user, "User not found by login");
    });

    it("UpdateUser", async () =>
    {
        const user = await User.GetById(id);

        if (!user) {
            throw new Error("No error we've just created");
        }
        user.password = passwnew;

        await User.Update(user);

        const user2 = await User.GetById(id);

        assert.ok(user2?.password === passwnew, "Password was updated");
    });

    it("AuthUser", async () =>
    {
        const auth = await AuthService.TryAuthWeb(login, passwnew);

        assert.ok(auth, "Authenticated is true");
    });

    it("DeleteUser", async () =>
    {
        await User.Delete(id);
    });
});
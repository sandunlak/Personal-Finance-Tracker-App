const request = require("supertest");
const express = require("express");
const app = express();
const router = require("../../Routes/addaccounts"); // Adjust path to match your file structure

// Use the router
app.use(express.json());
app.use(router);

// Mock the authenticate middleware
jest.mock("../../Middleware/authenticate", () => (req, res, next) => {
    req.user = { id: "mockUserId" }; // Mock authenticated user
    next();
});

// Mock the Addaccount model
jest.mock("../../Models/Addaccount", () => {
    return {
        save: jest.fn(),
        find: jest.fn(),
        findOneAndDelete: jest.fn(),
        findOneAndUpdate: jest.fn(),
    };
});

const Addaccount = require("../../Models/Addaccount");

describe("Account Routes", () => {
    it("should add a new account", async () => {
        Addaccount.prototype.save.mockImplementationOnce(() =>
            Promise.resolve()
        );

        const response = await request(app)
            .post("/addacc")
            .send({
                accname: "Savings",
                accnumber: "123456789",
                acctype: "Bank Account",
                accvalue: 1000,
                acccurrency: "USD",
                isRecurring: false,
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Your Account Added");
    });

    it("should fetch all accounts for authenticated user", async () => {
        Addaccount.find.mockResolvedValue([
            {
                accname: "Savings",
                accnumber: "123456789",
                acctype: "Bank Account",
            },
        ]);

        const response = await request(app).get("/showacc");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([
            {
                accname: "Savings",
                accnumber: "123456789",
                acctype: "Bank Account",
            },
        ]);
    });

    it("should delete an account", async () => {
        Addaccount.findOneAndDelete.mockResolvedValue({ _id: "mockAccountId" });

        const response = await request(app).delete("/delete/mockAccountId");
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Your Account deleted");
    });

    it("should update an account", async () => {
        Addaccount.findOneAndUpdate.mockResolvedValue({
            _id: "mockAccountId",
            accname: "Updated Savings",
        });

        const response = await request(app)
            .put("/update/mockAccountId")
            .send({ accname: "Updated Savings" });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Account details updated");
        expect(response.body.account.accname).toBe("Updated Savings");
    });
});

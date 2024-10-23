import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

app.use(cors());
app.use(
    bodyParser.json({
        type(req) {
            return true;
        },
    })
);
app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    next();
});

const users = [];
const messages = [];
let nextId = 1;

app.get("/messages", async (req, res) => {
    const from = Number(req.query.from);
    if (req.query.from === 0) {
        return res.send(JSON.stringify(messages));
    }

    const fromIndex = messages.findIndex((o) => o.id === from);
    if (fromIndex === -1) {
        return res.send(JSON.stringify(messages));
    }
    return res.send(JSON.stringify(messages.slice(fromIndex + 1)));
});

app.post("/messages", (req, res) => {
    //messages.push({ ...req.body, id: nextId++ }); // без проверки юзера
    const searchedUser = users.find(user => user.id === req.body.userId);
    // Пользователь уже есть в списке участников чата
    if (searchedUser) {
        if (searchedUser.hash !== req.body.userHash) {
            res.status(403);
            res.end();
            return;
        }
    } else {
        users.push({id: req.body.userId, hash: req.body.userHash});
    }
    messages.push({
        userId: req.body.userId,
        userHash: req.body.userHash,
        content: req.body.content,
        id: nextId++
    });
    res.status(204);
    res.end();
});

const port = process.env.PORT || 7070;
app.listen(port, () => console.log(`The server is running on port ${port}.`));
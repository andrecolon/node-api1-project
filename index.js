const express = require("express")
const id = require("shortid")
const server = express()

let users = [

            {
            id: id.generate(), // hint: use the shortid npm package to generate it
            name: "Jane Doe", // String, required
            bio: "Not Tarzan's Wife, another Jane",  // String, required
             },
            {
                id: id.generate(),
                name: "John Doe",
                bio: "Tarzan himself"
            },
            {
                id: id.generate(),
                name: "King Louie ",
                bio: "Monkey King"
            }

];

server.get('/', (req, res) => {
    //res.json({ hello: "World" })
    res.json(users)
})

server.get('/api/users', (req, res) => {
    if (users) {
        res.status(200).json(users)
    } else {
        res.status(500).json({
            errorMessage: "user not found"
        })
    }
})

server.get('/api/users/:id', (req, res) => {
    const { id } = req.params
    const found = users.find(user => user.id === id);
    if (found) {
        res.status(201).json(found);
    } else {
        res.status(404).json({
            message: "user with ID does not exist"
        })
    }
}
)
server.use(express.json())

server.post('/api/users', (req, res) => {
    const userInfo = req.body;

    if (userInfo.name === undefined || userInfo.bio === undefined) {
        res.status(400).json({
            errorMessage: "Missing name or bio."
        })
    } else {
        userInfo.id = shortid.generate();
        const oldLength = users.length;
        const newLength = users.push(userInfo)

        if (newLength === oldLength + 1) {

            res.status(201).json(userInfo);
        } else {
            res.status(500).json({
                errorMessage: "Error while saving"
            })
        }

    }
})

server.get("/api/users", (req, res) => {
    res.json(users);
})

server.delete(`/api/users/:id`, (req, res) => {
    const { id } = req.params

    if (!users || !users.id) {
        res.status(500).json({
            errorMessage: 'delete error'
        })
    } else {
        const deleted = users.find(user => user.id === id);

        if (deleted) {
            users = users.filter(user => user.id !== id);
            res.status(200).json(deleted);
        } else {
            res.status(404).json({ message: 'user not found' });
        }

    }
})

server.patch('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;
    if (!users || !users.id) {
        res.status(500).json({
            errorMessage: 'user could not be changed'
        })
    } else {
        if (changes.name === undefined && changes.bio === undefined) {
            res.status(400).json({
                errorMessage: 'Missing name and bio'
            })
        } else {
            let found = users.find(user => user.id === id);

            if (found) {
                Object.assign(found, changes);
                res.status(200).json(found);
            } else {
                res.status(404).json({ message: 'user id not found' });
            }
        }
    }
})

server.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;
    changes.id = id;
    if (!users || !users.id) {
        res.status(500).json({
            errorMessage: 'user could not be changed'
        })
    } else {
        if (changes.name === undefined && changes.bio === undefined) {
            res.status(400).json({
                errorMessage: 'Missing name and bio'
            })
        } else {
            let index = users.findIndex(user => user.id === id);

            if (index !== -1) {
                users[index] = changes;
                res.status(200).json(users[index]);
            } else {
                res.status(404).json({ message: 'user id not found' });
            }
        }
    }
})
const PORT = 5000
server.listen(PORT, () => {
    console.log("listening on localhost:", PORT);
})
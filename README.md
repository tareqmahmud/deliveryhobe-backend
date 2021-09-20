<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

# TStore ECommerce API

## Project Description


## Installation

#### Clone Project
```bash
git@github.com:tareqmahmud/tstore-backend.git
```

#### Install NPM Packages
```bash
$ npm install
```

#### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Route

#### Auth
| Route      | Method |  Body |  Description |
| ----------- | ----------- | ----------- | ------------- |
| `/auth/register`      | `POST`       | `{ firstName?: string, lastName?: string, username: string, email: string, password: string }` | To signup a user       |
| `/auth/login`      | `POST`       | `{ username: string, password: string }` | To login a user       |


#### Tasks
| Route      | Method | Body |  Description |
| ----------- | ----------- | ----------- | ---------- |
| `/tasks`      | `GET`       | `None` | To get all the tasks |
| `/tasks`      | `POST`       | ```{ title: string, description: string }``` | To save or create a task |
| `/tasks/:id`      | `GET`       | `None` | To get all a single task |
| `/tasks/:id`      | `PATCH`       | `{ status: OPEN or IN_PROGESS, or DONE }` | To update the status of a task |
| `/tasks/:id`      | `DELETE`       | `None` | To delete a task|


## TODO
- [ ] 


## License

Nest is [MIT licensed](LICENSE).

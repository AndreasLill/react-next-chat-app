## Overview

A small chat app written in TypeScript using React and NextJS frameworks with NodeJS and Microsoft SQL Server in the backend.<br>
Features user registration and authentication, chat rooms with real time communication using web sockets.<br>

## User Interface
The user interface is written using [Tailwind CSS](https://tailwindcss.com/) and [Lucide Icons](https://lucide.dev/) with primitive components using [Radix UI](https://www.radix-ui.com/) for accessibility.

## Authentication
Authentication is made using [NextAuth](https://next-auth.js.org/) with encrypted credentials stored in the SQL database using [Bcrypt](https://github.com/kelektiv/node.bcrypt.js).

## Data
Persistent data is stored using [Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server/) from the API using [Node MSSQL](https://github.com/tediousjs/node-mssql) and secured using sessions.<br>
Received data is fetched and cached from the API using [SWR](https://swr.vercel.app/) and sent data is validated in both client and API using [Zod](https://zod.dev/).

## Communication
Real time communication chat is solved with authenticated web sockets using [Pusher Channels](https://pusher.com/channels/) from the API.

create table users
(
    id         int auto_increment
        primary key,
    firstname  varchar(255)                        not null,
    lastname   varchar(255)                        not null,
    password   varchar(255)                        null,
    username   varchar(255)                        not null,
    created_at timestamp default CURRENT_TIMESTAMP null,
    updated_at datetime  default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    email      varchar(254)                        not null,
    constraint email
        unique (email),
    constraint id
        unique (id),
    constraint username
        unique (username)
);

create table roles
(
    id          int auto_increment,
    name        varchar(64)                         not null,
    codename    varchar(64)                         not null,
    description varchar(255)                        null,
    created_at  timestamp default CURRENT_TIMESTAMP null,
    updated_at  datetime  default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint codename
        unique (codename),
    constraint id
        unique (id),
    constraint name
        unique (name)
);

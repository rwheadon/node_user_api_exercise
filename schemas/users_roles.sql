create table users_roles
(
    id          int auto_increment,
    user_id     int                                 not null,
    role_id     int                                 not null,
    expire_date timestamp default CURRENT_TIMESTAMP null,
    created_at  timestamp default CURRENT_TIMESTAMP null,
    updated_at  datetime  default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint id
        unique (id)
);


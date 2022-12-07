create table todoList (
    user text not null,
    item text not null,
    done boolean not null default 0,
    primary key(item),
);
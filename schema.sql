create table todoList (
    user text not null,
    item varchar(1024) not null,
    done boolean not null default 0,
    primary key(item)
);
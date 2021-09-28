drop table car;
create table car(
  carId bigint(20) primary key not null auto_increment,
  maker varchar(50) not null,
  model varchar(100) not null,
  grade varchar(100) not null,
  bodyColor varchar(100) not null,
  price bigint(10) not null,
  navi bigint(1),
  kawa bigint(1),
  sr bigint(1)
);
insert into car(maker, model, grade, bodyColor, price, navi, kawa, sr)
values('日産', 'ノート', 'NISMO', 'ブラック', 200000, 1, 1, 1);

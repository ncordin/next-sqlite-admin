/*
TYPE          WRITE                 READ
number        parseInt              parseInt
float         parseFloat            parseFloat
string        param length?         rien length ?
bool          to 0/1                to true/false
enum          check throw           rien
date          string
datetime      Date -> string        new Date() 

auto create table
table error & monitoring



await Readings.insert({
  id,
  user: user.id,
  ressource,
  date,
  value,
  createdAt: Readings.sql('now()'),
});

await Readings.remove({
  where: {
    id,
    user: user.id,
  },
});

const readings = await Readings.findAll({ where: { user: user.id } });

await Readings.update({
  set: { value: Readings.sql('value - 10') },
  where: {
    user: 2,
    value: { '>=': 10 },
  },
});

const user = await Users.findOne({ where: { key } });

selectAs: {averageValue: "AVG(value)"}
where option: { 
    fieldC: {"in": [...]} 
},
group: [ fieldA, fieldB ]
having: whereOptions
sortBy: { fieldA: "desc" },
limit: { offset: 10, limit: 10 },
*/

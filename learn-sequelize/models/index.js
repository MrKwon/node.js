const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

/**
 * models/ * 들을 db라는 객체에 담아둠
 * db 객체를 require 하여 User 와 Comment 모델에 접근 가능
 */
db.User = require('./user')(sequelize, Sequelize);
db.Comment = require('./comment')(sequelize, Sequelize);
/*
db = {
  sequelize: sequelize,
  Sequelize: Sequelize,
};
*/

/**
 * db 객체 내의 모델들에 대한 관계 정의
 * 1:N - [a] hasMany [b] == [b] belongsTo [a] - a, b 도치 성립 불가능
 * 1:1 - [c] hasOne [d] == [d] belongsTo [c] - c, d 도치 성립 가능
 * N:M - [e] belongsToMany [f] == [f] belongsToMany [e] - e, f 도치 성립 가능
 */
db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id' });
db.Comment.belongsTo(db.User, { foreignKey: 'commenter', targetKey: 'id' });
/**
 * model_a.hasMany(model_b,
      { foreignKey: 'model_a나 _b의 외래 키로 설정한 컬럼명',
        sourceKey: '기준이 될 model_a의 key값'});
 * model_b.belongsTo(model_a,
      { foreignKey: 'hasMany의 foreignKey와 동일',
        targetKey: 'model_b에서 model_a의 연결된 로우를 찾을 때의 key값'})
 *
 * model_c.hasOne(model_d,
      { foreignKey: 'model_c나 _d의 외래 키로 설정한 컬럼명',
        sourceKey: '기준이 될 model_c의 key값'});
 * model_d.belongsTo(model_c,
      { foreignKey: 'hasOne의 foreignKey와 동일',
        targetKey: 'model_d에서 model_c의 연결된 로우를 찾을 때의 key값'})
 *
 * model_e.belongsToMany(model_f, { through: model_ef_associate });
 * model_f.belongsToMany(model_e, { through: model_ef_associate });
 * N:M 관계는 새로운 매개 테이블(내가 만든 말임)이 형성된다.
 * model_e와 model_f 간의 매개 테이블은 model_ef_associate 인데,
 * 관계는 model_e 와 model_f 각각의 key 쌍으로 model_ef_associate에 저장된다.
 */


module.exports = db;

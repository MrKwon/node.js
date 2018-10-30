/**
 * sequelize는 알아서 id를 기본 키로 연결하므로 id 컬럼은 적어줄 필요가 없음
 * sequelize.define('테이블명', { 컬럼의 스펙 객체 }, { 테이블 옵션 } );
 *
 * [[ sequelize의 데이터 타입 ]]
 * VARCHAR == DataTypes.STRING()
 * INT == DataTypes.INTEGER[.UNSIGNED[.ZEROFILL]]
 * TINYINT == DataTypes.BOOLEAN
 * DATETIME == DataTypes.DATE
 *
 * [[ sequelize의 column 옵션들 ]]
 * NOT NULL == allowNull: false
 * UNIQUE == unique: true
 * DEFAULT == defaultValue: 'defaultValue'
 *
 * [[ 테이블 옵션 ]]
 * timestamps: true/false - 타임스템프 옵션, true일 때 createdAt, updatedAt 컬럼 추가
 * paranoid: true/false - 타임스템프 옵션이 true일 때 사용가능, deletedAt(컬럼 삭제시간 기록) 컬럼이 추가
 * underscored: true/false - sequelize 자동생성 컬럼들 스네이크케이스 형식으로 변경 createdAt => created_at
 * tableName: 첫번째 인자의 '테이블명'의 복수형으로 테이블을 자동 생성하는데,
 *            - true 혹은 '원하는 테이블명'을 사용하면 자동 변환을 막아 '테이블명' 이 그대로 테이블명이 되고
 *            - false를 사용하면 자동 변환이 되어 '테이블명' + 's' 가 테이블명이 된다.
 */

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('user', {
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    age: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    married: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('now()'),
    },
  }, {
    timestamps: false,
  });
};

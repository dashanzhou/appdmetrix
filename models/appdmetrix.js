'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('appdmetrix', {
        MetricName: DataTypes.STRING,
        MetricPath: DataTypes.STRING,
        MaxValue: DataTypes.DECIMAL
    },
    {
        // Index by Jusdiction
        indexes: [{
            unique: false,
            fields: ['MetricName']
          },
        {
            unique: true,
            fields: ['MetricPath', 'MaxValue']
        }]
    });
};



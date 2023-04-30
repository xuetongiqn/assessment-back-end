import DataType from 'sequelize';
import Model from'./sequelize';

const Todo = Model.define('todo', {
    id: {
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    text: {
        type: DataType.STRING,
        allowNull: false,
    },
    priority: {
        type: DataType.INTEGER,
        defaultValue: 1,
        allowNull: false
    },
    isCompleted: {
        type: DataType.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    createTime: {
        type: DataType.DATE,
    },
    completedTime:{
        type: DataType.DATE,
    }
    
})

export default Todo;
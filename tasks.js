const { Op } = require('sequelize');
const { User, Post, Book, Author, Student, Course, Enrollment, Order, Item } = require('./models');

//Задание 1
//Пользователи с постами после 2023-01-01
//where внутри include фильтрует связанные посты по дате
//required: true превращает JOIN в INNER, отсеивая пользователей без подходящих постов
//order: сначала сортировка по имени пользователя затем вложенный массив для сортировки постов по дате
async function getUsersWithRecentPosts() {
    return User.findAll({
        include: [{
            model: Post,
            as: 'posts',
            where: { publishedAt: { [Op.gt]: '2023-01-01' } },
            required: true,
        }],
        order: [
            ['name', 'ASC'],
            [{ model: Post, as: 'posts' }, 'publishedAt', 'DESC'],
        ],
    });
}

//Задание 2
//Все авторы включая тех у кого нет книг
//required: false дает LEFT JOIN сохраняя авторов с пустым массивом книг
//order: сортировка по фамилии автора
async function getAllAuthorsIncludingEmpty() {
    return Author.findAll({
        include: [{
            model: Book,
            as: 'books',
            required: false,
        }],
        order: [
            ['lastName', 'ASC'],
        ],
    });
}

//Задание 3
//Студенты на курсах с credits > 3 (N:M)
//where внутри include фильтрует курсы по кредитам
//required: true оставляет только студентов у которых есть хотя бы один такой курс
//through: { attributes: [] } скрывает поля соединительной таблицы Enrollment
//order: сортировка студентов по имени,курсов по названию
async function getStudentsInAdvancedCourses() {
    return Student.findAll({
        include: [{
            model: Course,
            as: 'courses',
            where: { credits: { [Op.gt]: 3 } },
            required: true,
            through: { attributes: [] },
        }],
        order: [
            ['name', 'ASC'],
            [{ model: Course, as: 'courses' }, 'title', 'ASC'],
        ],
    });
}

//Задание 4
//Заказы с товарами quantity > 2
//where фильтрует товары по количеству
//required: true оставляет только заказы, содержащие хотя бы один такой товар
//order: сортировка заказов по дате создания (DESC) товаров - по цене (DESC)
async function getOrdersWithBulkItems() {
    return Order.findAll({
        include: [{
            model: Item,
            as: 'items',
            where: { quantity: { [Op.gt]: 2 } },
            required: true,
        }],
        order: [
            ['createdAt', 'DESC'],
            [{ model: Item, as: 'items' }, 'price', 'DESC'],
        ],
    });
}

//Задание 5
//Активные пользователи с опубликованными постами
//Два уровня фильтрации - верхнеуровневый where (isActive: true) для User и вложенный where (status: 'published') для Post
//required: true отсеивает пользователей без опубликованных постов
//order: сортировка пользователей по имени, постов - по дате создания (DESC)
async function getActiveUsersWithPublishedPosts() {
    return User.findAll({
        where: { isActive: true },
        include: [{
            model: Post,
            as: 'posts',
            where: { status: 'published' },
            required: true,
        }],
        order: [
            ['name', 'ASC'],
            [{ model: Post, as: 'posts' }, 'createdAt', 'DESC'],
        ],
    });
}

module.exports = {
    getUsersWithRecentPosts,
    getAllAuthorsIncludingEmpty,
    getStudentsInAdvancedCourses,
    getOrdersWithBulkItems,
    getActiveUsersWithPublishedPosts,
};
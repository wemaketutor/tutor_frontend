import React, { useState } from 'react';
import styles from './Resources.module.css';

const Resources = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const books = [
        { author: 'Иван Иванов', subject: 'Математика', title: 'Алгебра 9 класс', link: '/' },
        { author: 'Петр Петров', subject: 'Математика', title: 'Геометрия 10 класс', link: '/' },
        { author: 'Сергей Сергеев', subject: 'Физика', title: 'Основы механики', link: '/' },
        { author: 'Александр Александров', subject: 'Химия', title: 'Органическая химия', link: '/' },
        { author: 'Мария Мариева', subject: 'Биология', title: 'Анатомия человека', link: '/' },
        { author: 'Елена Еленова', subject: 'Литература', title: 'Русская классика', link: '/' },
        { author: 'Дмитрий Дмитриев', subject: 'История', title: 'История России', link: '/' },
        { author: 'Анна Анникова', subject: 'География', title: 'Физическая география мира', link: '/' },
        { author: 'Виктор Викторов', subject: 'Информатика', title: 'Основы программирования', link: '/' },
        { author: 'Ольга Ольгова', subject: 'Английский язык', title: 'Практическая грамматика', link: '/' }
    ];

    const filteredBooks = books.filter((book) =>
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Список книг по школьным предметам</h1>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    className={styles.searchInput}
                    id="searchInput"
                    placeholder="Поиск книг..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <ul className={styles.bookList}>
                {filteredBooks.map((book, index) => (
                    <li key={index} className={styles.bookItem}>
                        <span className={styles.author}>{book.author}</span> -{' '}
                        <span className={styles.subject}>{book.subject}</span>{' '}
                        <a href={book.link} className={styles.link}>
                            {book.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Resources;
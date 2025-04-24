import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Events.module.css';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [eventToUpdate, setEventToUpdate] = useState({});
    const [eventToCreate, setEventToCreate] = useState({
        date: '',
        duration: '',
        name: '',
        description: '',
        getingPersonId: ''
    });
    const [redacted, setRedacted] = useState(false);
    const navigate = useNavigate();

    const goPage = (name) => {
        navigate(`/${name}`);
    };

    const loadEvents = async () => {
        try {
            const response = await axios.get('/myevents', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setEvents(response.data.ownerEvents || []);
        } catch (error) {
            console.error('Failed to load events:', error.response ? error.response.data : error.message);
        }
    };

    const deleteEvent = async (eventId) => {
        try {
            await axios.delete(`/delete/event/${eventId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            loadEvents();
        } catch (error) {
            console.error('Failed to delete event:', error.response ? error.response.data : error.message);
        }
    };

    const createEvent = async (e) => {
        e.preventDefault();
        try {
            const eventData = { ...eventToCreate, date_created: new Date() };
            await axios.post('/addevent', eventData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setEventToCreate({
                date: '',
                duration: '',
                name: '',
                description: '',
                getingPersonId: ''
            });
            loadEvents();
        } catch (error) {
            console.error('Failed to create event:', error.response ? error.response.data : error.message);
        }
    };

    const updateEvent = async (e) => {
        e.preventDefault();
        try {
            const eventData = { ...eventToUpdate, date_created: new Date() };
            await axios.put('/update/event', eventData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setRedacted(false);
            setEventToUpdate({});
            loadEvents();
        } catch (error) {
            console.error('Failed to update event:', error.response ? error.response.data : error.message);
        }
    };

    const eventUpdate = (event) => {
        setEventToUpdate({ ...event });
        setRedacted(true);
    };

    const handleCreateInputChange = (e) => {
        const { name, value } = e.target;
        setEventToCreate((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateInputChange = (e) => {
        const { name, value } = e.target;
        setEventToUpdate((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        loadEvents();
    }, []);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Ближайшие события</h2>
            {events.length === 0 && (
                <h5 className={styles.emptyMessage}>Создайте событие</h5>
            )}
            {events.map((event, index) => (
                <div key={index}>
                    <div className={styles.headerRow}>
                        <div className={styles.headerCell}>Организатор</div>
                        <div className={styles.headerCell}>Название</div>
                        <div className={styles.headerCell}>Описание</div>
                        <div className={styles.headerCell}>Гость</div>
                        <div className={styles.headerCell}>Начало</div>
                        <div className={styles.headerCell}>Конец</div>
                        <div className={styles.headerCell}></div>
                    </div>
                    <div className={styles.dataRow}>
                        <div className={styles.dataCell}>{event.user.email}</div>
                        <div className={styles.dataCell}>{event.name}</div>
                        <div className={styles.dataCell}>{event.description}</div>
                        <div className={styles.dataCell}>{event.folowed_user.email}</div>
                        <div className={styles.dataCell}>{event.date}</div>
                        <div className={styles.dataCell}>{event.duration}</div>
                        <div className={styles.dataCell}>
                            <div className={styles.deleteLink} onClick={() => deleteEvent(event.id)}>Удалить</div>
                            <div className={styles.updateLink} onClick={() => eventUpdate(event)}>Обновить</div>
                        </div>
                    </div>
                </div>
            ))}

            <h2 className={styles.title}>Создать новое событие</h2>
            <form className={styles.form} onSubmit={createEvent}>
                <div className={styles.formGroup}>
                    <label htmlFor="date" className={styles.formLabel}>Начало</label>
                    <input
                        type="datetime-local"
                        className={styles.formInput}
                        id="date"
                        name="date"
                        required
                        value={eventToCreate.date}
                        onChange={handleCreateInputChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="duration" className={styles.formLabel}>Окончание</label>
                    <input
                        type="datetime-local"
                        className={styles.formInput}
                        id="duration"
                        name="duration"
                        required
                        value={eventToCreate.duration}
                        onChange={handleCreateInputChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.formLabel}>Название</label>
                    <input
                        type="text"
                        className={styles.formInput}
                        id="name"
                        name="name"
                        placeholder="Введите название события"
                        required
                        value={eventToCreate.name}
                        onChange={handleCreateInputChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="description" className={styles.formLabel}>Описание</label>
                    <input
                        type="text"
                        className={styles.formInput}
                        id="description"
                        name="description"
                        placeholder="Введите описание события"
                        required
                        value={eventToCreate.description}
                        onChange={handleCreateInputChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="gettingPersonId" className={styles.formLabel}>ID получателя</label>
                    <input
                        type="number"
                        className={styles.formInput}
                        id="gettingPersonId"
                        name="getingPersonId"
                        placeholder="Введите ID пользователя"
                        required
                        value={eventToCreate.getingPersonId}
                        onChange={handleCreateInputChange}
                    />
                </div>
                <button type="submit" className={styles.submitButton}>Создать событие</button>
            </form>

            <h2 className={`${styles.title} ${!redacted ? styles.hidden : ''}`}>Обновить событие</h2>
            <form className={`${styles.form} ${!redacted ? styles.hidden : ''}`} onSubmit={updateEvent}>
                <div className={styles.formGroup}>
                    <label htmlFor="date-update" className={styles.formLabel}>Начало</label>
                    <input
                        type="datetime-local"
                        className={styles.formInput}
                        id="date-update"
                        name="date"
                        required
                        value={eventToUpdate.date || ''}
                        onChange={handleUpdateInputChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="duration-update" className={styles.formLabel}>Окончание</label>
                    <input
                        type="datetime-local"
                        className={styles.formInput}
                        id="duration-update"
                        name="duration"
                        required
                        value={eventToUpdate.duration || ''}
                        onChange={handleUpdateInputChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="name-update" className={styles.formLabel}>Название</label>
                    <input
                        type="text"
                        className={styles.formInput}
                        id="name-update"
                        name="name"
                        placeholder="Введите название события"
                        required
                        value={eventToUpdate.name || ''}
                        onChange={handleUpdateInputChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="description-update" className={styles.formLabel}>Описание</label>
                    <input
                        type="text"
                        className={styles.formInput}
                        id="description-update"
                        name="description"
                        placeholder="Введите название события"
                        required
                        value={eventToUpdate.description || ''}
                        onChange={handleUpdateInputChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="gettingPersonId-update" className={styles.formLabel}>ID получателя</label>
                    <input
                        type="number"
                        className={styles.formInput}
                        id="gettingPersonId-update"
                        name="getingPersonId"
                        required
                        value={eventToUpdate.getingPersonId || ''}
                        onChange={handleUpdateInputChange}
                    />
                </div>
                <button type="submit" className={styles.submitButton}>Сохранить событие</button>
            </form>
        </div>
    );
};

export default Home;
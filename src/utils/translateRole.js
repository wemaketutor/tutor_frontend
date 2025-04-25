function translateRole(role) {
    switch (role) {
        case 'teacher':
            return 'Преподаватель';
        case 'student':
            return 'Ученик';
        case 'admin':
            return 'Администратор';
        default:
            return 'Неизвестная роль';
    }
}

export default translateRole;


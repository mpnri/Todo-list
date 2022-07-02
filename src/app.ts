import sun from '../assets/images/icon-sun.svg';
import moon from '../assets/images/icon-moon.svg';

enum THEMES {
    LIGHT = 'LIGHT',
    DARK = 'DARK',
}

const styles = {
    [THEMES.DARK]: {
        '--body-background': 'var(--very-dark-desaturated-blue)',
        '--body-color': 'var(--light-grayish-blue)',
        '--bg-header-small': 'var(--dark-bg-image-small)',
        '--bg-header-large': 'var(--dark-bg-image-large)',
        '--todo-card-bg-color': 'var(--very-dark-grayish-blue-hover)',
        '--todo-card-bg-color-hover': 'var(--very-dark-grayish-blue)',
        '--todo-card__action-filter': 'var(--dark-action-filter)',
        '--todo-card-border-color': 'var(--very-dark-grayish-blue)',
    },
    [THEMES.LIGHT]: {
        '--body-background': 'var(--very-light-gray)',
        '--body-color': 'var(--very-dark-grayish-blue)',
        '--bg-header-small': 'var(--light-bg-image-small)',
        '--bg-header-large': 'var(--light-bg-image-large)',
        '--todo-card-bg-color': 'var(--very-light-gray)',
        '--todo-card-bg-color-hover': 'var(--light-grayish-blue-hover)',
        '--todo-card__action-filter': 'var(--light-action-filter)',
        '--todo-card-border-color': 'var(--very-light-grayish-blue)',
    },
}

let theme = THEMES.LIGHT;

document.querySelector('.header__icon')?.addEventListener('click', e => {
    const target = (e.currentTarget as HTMLDivElement).children[0] as HTMLImageElement;
    theme = theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    
    target.src = theme === THEMES.LIGHT ? moon : sun;
    renderTheme();
})


renderTheme();


function renderTheme() {
    Object.keys(styles[theme]).forEach(key => document.documentElement.style.setProperty(key, styles[theme][key]));
    
}
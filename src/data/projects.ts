export interface Project {
    title: string
    description: string
    link: string
    image: string
    alt: string
}

export const projects: Project[] = [
    {
        title: 'English Typing Practice',
        description: '一次敲击，一点进步；记忆不再盲目，学习更高效。',
        link: 'https://type.bytecho.tech',
        image: '/src/assets/projects/1.jpg',
        alt: 'English Typing Practice'
    },
    {
        title: 'Lorem ipsum',
        description: 'Old age burn and rave at close of day',
        link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        image: '/src/assets/projects/2.jpg',
        alt: 'Demo Project'
    }
]

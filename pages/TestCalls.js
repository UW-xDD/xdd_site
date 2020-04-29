import axios from 'axios';

const ARTICLES = 'http://geodeepdive.org/api/articles';

export default {


    async getArticle(id) {
        try {
            const response = await fetch(ARTICLES + 'posts/' + id, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization' : 'Bearer ' + TOKEN,
                },
            });

            return await response.json();

        } catch(error) {
            console.error(error);
        }
    }
}

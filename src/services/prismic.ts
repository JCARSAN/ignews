import * as Prismic from '@prismicio/client'

export const repositoryName = 'ignewsnextstudy';

export function getPrismicClient(){
    const prismic = Prismic.createClient(repositoryName,
        {
            accessToken: process.env.PRISMIC_ACCESS_TOKEN,
            routes: [],
        }
    )
    //console.log('Prismic: ',prismic)
    return prismic;
}
import { NextApiRequest, NextApiResponse } from 'next';

export default (request: NextApiRequest, response: NextApiResponse) => {
    const id = Number(request.query.id);
    //console.log(request.query)
    const users = [
        {id: 1, name: 'Diego'},
        {id: 2, name: 'Dani'},
        {id: 3, name: 'Rafa'}
    ]
    const user = users.find((currentUser) => {
        return currentUser.id === id
    })
    //console.log(user);
    return response.json(user);
}
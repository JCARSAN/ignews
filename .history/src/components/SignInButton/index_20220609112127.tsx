import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { signIn } from 'next-auth/react'

import styles from './styles.module.scss';

export function SignInButton(){

    const isUserLoggedIn = false;
    
    return isUserLoggedIn ?
    (
        <button 
            type="button"
            className={styles.signInButton}
            onClick={() => signIn('github')}
        >
            <FaGithub color='#04d361'/>
            Júlio Cardoso
            <FiX color='#737380' className={styles.closeIcon}/>
        </button>
    )
    :
    (
        <button type="button"
                className={styles.signInButton}
        >
            <FaGithub color='#eba417' className={styles.closeIcon}/>
            SignIn with Github
        </button>
    )
}
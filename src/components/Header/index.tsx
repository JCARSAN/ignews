import styles from './styles.module.scss';
import Image from 'next/image';
import { SignInButton } from '../SignInButton';
import { ActiveLink } from '../ActiveLinks';

export function Header(){
    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Image 
                    src='/images/logo.svg'
                    alt='ig news, o seu blog de tecnologia'
                    width='110'
                    height='31'
                />
                <nav>
                    <ActiveLink activeClassName={styles.active} href="/">
                        <a>Home</a>
                    </ActiveLink>
                    <ActiveLink activeClassName={styles.active} href="/posts" prefetch>
                        <a>Posts</a>
                    </ActiveLink>
                </nav>
                <SignInButton />
            </div>
        </header>
    );
}
import { useEffect, useState } from "react";
import { Popover, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import Movie from "./Movie";
import "antd/dist/antd.css";
import styles from "../styles/Home.module.css";

function Home() {
    const [likedMovies, setLikedMovies] = useState([]);
    const [moviesData, setMoviesData] = useState([]);

    const BACKEND_URL = "mymoviz-backend-three-inky.vercel";
    const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500";

    useEffect(() => {
        fetch(`${BACKEND_URL}/movies`)
            .then((response) => response.json())
            .then((data) => {
                if (data.movies) {
                    // 🎯 Formatage des données AVANT de mettre à jour l'état
                    const formattedMovies = data.movies.map((movie) => {
                        // 🎯 1. Formatage de l'URL de l'image
                        const posterUrl = movie.poster_path
                            ? `${IMG_BASE_URL}${movie.poster_path}`
                            : "placeholder.jpg"; // Ajoutez une image par défaut si le poster manque

                        // 🎯 2. Troncation de l'overview à 250 caractères
                        let truncatedOverview = movie.overview;
                        if (
                            truncatedOverview &&
                            truncatedOverview.length > 250
                        ) {
                            truncatedOverview =
                                truncatedOverview.substring(0, 250) + "...";
                        }

                        return {
                            title: movie.title,
                            overview: truncatedOverview, // Description tronquée
                            poster: posterUrl, // URL complète
                            voteAverage: movie.vote_average,
                            voteCount: movie.vote_count,
                        };
                    });

                    setMoviesData(formattedMovies);
                }
            });
    }, []);

    // Liked movies (inverse data flow)
    const updateLikedMovies = (movieTitle) => {
        if (likedMovies.find((movie) => movie === movieTitle)) {
            setLikedMovies(likedMovies.filter((movie) => movie !== movieTitle));
        } else {
            setLikedMovies([...likedMovies, movieTitle]);
        }
    };

    const likedMoviesPopover = likedMovies.map((data, i) => {
        return (
            <div key={i} className={styles.likedMoviesContainer}>
                <span className="likedMovie">{data}</span>
                <FontAwesomeIcon
                    icon={faCircleXmark}
                    onClick={() => updateLikedMovies(data)}
                    className={styles.crossIcon}
                />
            </div>
        );
    });

    const popoverContent = (
        <div className={styles.popoverContent}>{likedMoviesPopover}</div>
    );

    // Movies list
    //const moviesData = [
    //  { title: 'Forrest Gump', poster: 'forrestgump.jpg', voteAverage: 9.2, voteCount: 22_705, overview: 'A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case.' },
    //  { title: 'The Dark Knight', poster: 'thedarkknight.jpg', voteAverage: 8.5, voteCount: 27_547, overview: 'Batman raises the stakes in his war on crime and sets out to dismantle the remaining criminal organizations that plague the streets.' },
    //  { title: 'Your name', poster: 'yourname.jpg', voteAverage: 8.5, voteCount: 8_691, overview: 'High schoolers Mitsuha and Taki are complete strangers living separate lives. But one night, they suddenly switch places.' },
    //  { title: 'Iron Man', poster: 'ironman.jpg', voteAverage: 7.6, voteCount: 22_7726, overview: 'After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.' },
    //  { title: 'Inception', poster: 'inception.jpg', voteAverage: 8.4, voteCount: 31_546, overview: 'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life.' },
    //];

    const movies = Array.isArray(moviesData) ? (
        moviesData.map((data, i) => {
            const isLiked = likedMovies.some((movie) => movie === data.title);
            return (
                <Movie
                    key={i}
                    updateLikedMovies={updateLikedMovies}
                    isLiked={isLiked}
                    title={data.title}
                    overview={data.overview}
                    poster={data.poster}
                    voteAverage={data.voteAverage}
                    voteCount={data.voteCount}
                />
            );
        })
    ) : (
        <p>Chargement des films en cours ou aucune donnée disponible...</p>
    );

    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <div className={styles.logocontainer}>
                    <img src="logo.png" alt="Logo" />
                    <img
                        className={styles.logo}
                        src="logoletter.png"
                        alt="Letter logo"
                    />
                </div>
                <Popover
                    title="Liked movies"
                    content={popoverContent}
                    className={styles.popover}
                    trigger="click"
                >
                    <Button>♥ {likedMovies.length} movie(s)</Button>
                </Popover>
            </div>
            <div className={styles.title}>LAST RELEASES</div>
            <div className={styles.moviesContainer}>{movies}</div>
        </div>
    );
}

export default Home;

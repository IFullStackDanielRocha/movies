import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { View, StyleSheet, TouchableOpacity, Text, Image, ActivityIndicator } from "react-native";
import { CalendarBlank, CaretLeft, Clock, HeartStraight, Star } from "phosphor-react-native";

type MovieDetails = {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    runtime: string;
    release_date: string;
    vote_average: number;
};

type RouterProps = {
    movieId: number;
};

export function Details() {

    const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const route = useRoute();
    const { movieId } = route.params as RouterProps;
    const navigation = useNavigation();


    useEffect(() => {
        const fecthMovieDetails = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/movie/${movieId}`);
                setMovieDetails(response.data);
                console.log(JSON.stringify(response.data, null, 2))
                setLoading(false);
            } catch (error) {

                console.log(error);
                setLoading(false);
            }

        };

        fecthMovieDetails();
    }, [movieId]);

    function getYear(data: string) {
        const year = new Date(data).getFullYear();
        return year;
    }

    return (
        <View style={styles.container}>

            <View style={styles.header}>

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <CaretLeft color="#fff" size={32} weight="thin" />
                </TouchableOpacity>

                <Text style={styles.headerText}>Details</Text>

                <TouchableOpacity>
                    <HeartStraight color="#fff" size={32} weight="thin" />
                </TouchableOpacity>
            </View>

            {loading && <ActivityIndicator size="large" color="#fff" />}
            {!loading && <>

                <View>
                    <Image
                        source={{
                            uri: `https://image.tmdb.org/t/p/w500${movieDetails?.backdrop_path}`,

                        }}
                        style={styles.detailsImage}
                    />

                    <Image
                        source={{
                            uri: `https://image.tmdb.org/t/p/w500${movieDetails?.poster_path}`,

                        }}
                        style={styles.detailsPosterImage}
                    />

                    <Text style={styles.titleMovie}>{movieDetails?.title}</Text>
                    <View style={styles.description}>
                        <View style={styles.descriptionGroup}>
                            <CalendarBlank color="#fff" size={25} weight="thin" />
                            <Text style={styles.descriptionText}>
                                {getYear(movieDetails?.release_date)}
                            </Text>
                        </View>

                        <View style={styles.descriptionGroup}>
                            <Clock color="#fff" size={25} weight="thin" />
                            <Text style={styles.descriptionText}>
                                {`${movieDetails?.runtime} minutes`}
                            </Text>
                        </View>


                        <View style={styles.descriptionGroup}>
                            <Star
                                color={movieDetails?.vote_average.toFixed(2) >= "7" ? "#ff8700" : "#fff"}
                                size={25}
                                weight={movieDetails?.vote_average.toFixed(2) >= "7" ? "fill" : "thin"} />
                            <Text style={[
                                movieDetails?.vote_average.toFixed(2) >= "7" ? styles.descriptionText1 : styles.descriptionText]}>
                                {movieDetails?.vote_average.toFixed(1)}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.about}>
                    <Text style={styles.aboutTitle}> Sinopse</Text>
                    <Text style={styles.aboutText}>{movieDetails.overview === "" ? 'There is no description for this movie.' : movieDetails.overview}</Text>

                </View>

            </>}


        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1e1e1e",

    },
    header: {
        paddingTop: 30,
        height: 115,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around"
    },
    headerText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 18,
    },
    detailsImage: {
        position: "absolute",
        width: "100%",
        height: 210,
    },
    detailsPosterImage: {
        width: 100,
        height: 160,
        borderRadius: 16,
        left: 29,
        right: 251,
        top: 140,
    },
    titleMovie: {
        color: "#fff",
        position: "absolute",
        height: 50,
        left: 140,
        right: 32,
        top: 240,
        fontSize: 18,
        lineHeight: 27,
        fontWeight: "700",

    },
    description: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 170,
    },
    descriptionGroup: {
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
    },
    descriptionText: {
        color: "#fff",
        marginRight: 10,
    },

    descriptionText1: {
        color: "#ff8700",
        marginRight: 10,
    },

    about: {
        padding: 20,

    },
    aboutTitle: {
        color: "#fff",
        marginBottom: 20,
    },
    aboutText: {
        color: "#fff",
        textAlign: "justify"
    },


});
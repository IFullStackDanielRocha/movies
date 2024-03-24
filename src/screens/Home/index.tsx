import { View, Text, StyleSheet, TextInput, FlatList, ActivityIndicator } from "react-native";
import { styles } from "./styles";
import { MagnifyingGlass } from "phosphor-react-native";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { CardMovies } from "../../components/CardNovies";
import { useNavigation } from "@react-navigation/native";


interface Movies {
    id: number;
    title: string;
    poster_path: string;
    overview: string;

}


export function Home() {

    const [discoveryMovies, setDiscoveryMovies] = useState<Movies[]>([]);
    const [searchResultMovie, setSearchResultMovie] = useState<Movies[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [noResult, setNoResult] = useState(false);
    const [search, setSearch] = useState("");



    useEffect(() => {
        loadMoreData();
    }, [])

    const loadMoreData = async () => {
        setLoading(true)
        const response = await api.get("/movie/popular", {
            params: { page, },
        });
        setDiscoveryMovies([...discoveryMovies, ...response.data.results]);
        setPage(page + 1);
        setLoading(false);
        //console.log(JSON.stringify(response.data, null, 2));
    };

    const searchMovie = async (query: string) => {
        setLoading(true);
        const response = await api.get("/search/movie", {
            params: {
                query,
            }
        });

        if (response.data.results.length == 0) {
            setNoResult(true)
        } else {
            setSearchResultMovie(response.data.results);
        }
        setLoading(false);
    };

    const handleSearch = (text: string) => {
        setSearch(text)
        if (text.length > 2) {
            searchMovie(text)
        } else {
            setSearchResultMovie([]);
        }
    }


    const navigation = useNavigation();

    const renderMovieItem=({item}:{item:Movies})=>(
        <CardMovies data={item} onPress={()=> navigation.navigate("Details",{
            movieId: item.id,
        })}/>
    )


    const movieData = search.length > 2 ? searchResultMovie : discoveryMovies;


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}> What do want wacth today ?</Text>

                <View style={styles.containerInput}>
                    <TextInput
                        placeholderTextColor="#fff"
                        placeholder="Search"
                        style={styles.input}
                        value={search}
                        onChangeText={handleSearch} />
                    <MagnifyingGlass color="#fff" size={25} weight="light" />
                </View>
            </View>
            <View>
                <FlatList
                    data={movieData}
                    numColumns={3}
                    renderItem={renderMovieItem}//{(item) => <CardMovies data={item.item} />}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingLeft: 25,
                        paddingBottom: 100,
                    }}
                    onEndReached={() => loadMoreData()}
                    onEndReachedThreshold={0.5}

                />
                {loading && <ActivityIndicator size={50} color="#0296e5" />}
            </View>
        </View>
    )
}
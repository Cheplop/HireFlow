import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet } from 'react-native';
import { PostsProvider } from '../../contexts/PostsContext';

export default function TabLayout() {
    return (
        <PostsProvider>
            <Tabs
                screenOptions={{
                    tabBarStyle: styles.tabBar,
                    tabBarActiveTintColor: '#4B5694',
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons
                                name={focused ? 'home-sharp' : 'home-outline'}
                                color={color}
                                size={24}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="applications"
                    options={{
                        title: 'Applications',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons
                                name={focused ? 'newspaper-sharp' : 'newspaper-outline'}
                                color={color}
                                size={24}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Profile',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons
                                name={focused ? 'person-sharp' : 'person-outline'}
                                color={color}
                                size={24}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="posts"
                    options={{
                        title: 'Posts',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons
                                name={focused ? 'add-sharp' : 'add-outline'}
                                color={color}
                                size={24}
                            />
                        ),
                    }}
                />
            </Tabs>
        </PostsProvider>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        alignSelf: 'center',
        
        marginHorizontal: 20,

        bottom: 20,
        height: 60,
        borderRadius: 20,
        borderTopWidth: 0,

        backgroundColor: 'white',

        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
});
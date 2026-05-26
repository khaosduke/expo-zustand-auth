import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function Index() {
    return (
        <View style={styles.container}>
            <Text>Welcome to the Home Screen!</Text>
            <TouchableOpacity
              onPress={() => supabase.auth.signOut()}
            >
              <Text>Sign Out</Text>
            </TouchableOpacity>
         </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
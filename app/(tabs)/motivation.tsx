import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const API = 'https://zenquotes.io/api/random';

//Types
interface quotesAPI{
  q: string;
  a: string;
}

interface quotesProps{
  quotes: string;
  author: string;
}

//UI components
const Quote: React.FC<quotesProps> = ({quotes, author}) =>(
  <View>
    <Text style={styles.quotesText}>{quotes}</Text>
    <Text style={styles.quotesAuthor}> ~ {author}</Text>
  </View>
)

export default function MotivationScreen() {
  const [quote, setQuote] = useState<quotesAPI | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    setLoading(true);

    fetch(API)
    .then((res) => res.json())
    .then((json: quotesAPI[])=>{
      if (Array.isArray(json) && json.length > 0){
        setQuote(json[0]);
      }
      else{
        setError("no quote found")
      }
    })
    .catch((e) => setError(e?.message ?? 'Feild to fetch'))
    .finally(()=> setLoading(false))
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Motivation Tab</Text>
      {error ? <Text style={{color: 'red'}}>{error} </Text> : null}
      
      <View style={styles.quotes}>
        {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
      quote && (
        <Quote
          quotes={quote.q}
          author={quote.a}
        />
      )
      )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 70,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center'
  },
  quotes: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  quotesText: {
    fontSize: 15,
    fontStyle: 'italic'
  },
  quotesAuthor:{
    fontWeight:"600"
  }
  
});
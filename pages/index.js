import Head from 'next/head'
import Form from '../components/blockerForm'
import fetchBlockers from '../components/fetchBlockers'
import styles from '../styles/Home.module.css'
import { TagCloud } from 'react-tagcloud'

export default function Home({ tags }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Wordcloud</title>
      </Head>

      <main className={styles.main}>
        <Form />
        <TagCloud
          minSize={12}
          maxSize={35}
          tags={tags}
          onClick={tag => alert(`'${tag.value}' was selected!`)}
        />
      </main>
    </div>
  )
}

export async function getServerSideProps(context) {
  
  const data = await fetchBlockers();
  const tags = [];

  data.forEach(function(dict){
    let newDict = {}
    delete Object.assign(newDict, dict, {value: dict._id })._id;    
    tags.push(newDict)
  });

  console.log(`list of docs: ${JSON.stringify(tags)}`);
  
  return {
    props: { tags },
  };
}
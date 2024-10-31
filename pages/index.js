import React, {useState} from 'react';

export async function getServerSideProps() {
    // 获取数据
    const res = await fetch('https://api.thecatapi.com/v1/images/search')
    console.log('res', res)
    const cat = await res.json()
    // 通过 props 将数据传给 page
    return { props: { cat} }
}

export default function Page({ cat }) {
    const [count, setCount] = useState(0);

    if (!cat) return <div>loading...</div>

    return (
        <>
            <img src={cat[0].url} width="200"/>

            <div>
                <h1>Counters {count} times</h1>
                <button onClick={() => setCount(count + 1)}>
                    Click me
                </button>
            </div>
        </>
    )


}

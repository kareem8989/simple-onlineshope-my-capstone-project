import useProducts from "../hooks/useProducts";
import ProductContainer from "../components/ProductContainer";
import ProductCard from "../components/ProductCard";
import React, {useEffect, useState} from "react";
import axios from "axios";
import DeleteButton from "../components/DeleteButton";
import {deleteProduct, getProductByCategory} from "../api/ProductApi";
import UpdateProductButton from "../components/UpdateProductButton";
import AddButton from "../components/AddButton";
import useAuth from "../hooks/useAuth";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import {useParams} from "react-router-dom";

export default function Home() {

    const {category} = useParams();
    const [files, setFiles] = useState<File[] | null>()
    const [productId, setProductId] = useState("")
    const [searchParam,setSearchParam] = useState('')
    const [products, setProducts,isReady] = useProducts(searchParam);
    const[user] = useAuth()

    console.log(category)

    const onSubmit = async (e: React.FormEvent) => {
        // FILE UPLOAD
        e.preventDefault();
        if (!files) {
            return;
        }
        const formData = new FormData();
        for (const file of files) {
            formData.append("file[]", file);
        }
        setFiles(null)
        const res = await axios.post("/api/products", formData);
        setProducts([...products, res.data])
    }
    const onUpdate = async (e: React.FormEvent) => {
        // FILE UPLOAD
        e.preventDefault();
        if (!files) {
            return;
        }
        const formData = new FormData();
        for (const file of files) {
            formData.append("file[]", file);
        }
        const res = await axios.post("/api/products/update/" + productId, formData);

        setProducts([...res.data]);
        setFiles(null)
    }
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length) {
            const f = [];
            for (let i = 0; i < e.target.files.length; i++) {
                f.push(e.target.files[i]);
            }
            setFiles(f);
        }

    }
    const onDelete = (id: string) => {
        const theNewProducts = products.filter(f => f.id !== id);
        setProducts([...theNewProducts])
        deleteProduct(id)
    }

    useEffect(() => {
        (async () => {
            if(category){
                const productss = await getProductByCategory(category)
                setProducts(productss)
            }else{
                setProducts([...products])
            }
        })();
    }, [category]);




    return (
        <>
            <NavBar user={user} onSearch={(e) => setSearchParam(e)} />
            {isReady && products.length > 0 ?
            <ProductContainer>
                {products.map(p => <div key={p.id} className={"product-card"}><ProductCard product={p}/>
                    {/*CURD BUTTONS*/}
                    <div className={"crud-buttons-container"}>
                        <UpdateProductButton onChange={onChange} onSubmit={onUpdate} onClick={() => {
                            setProductId(p.id)
                        }}/>
                        <DeleteButton onDelete={() => onDelete(p.id)}/>
                    </div>
                </div>)}
            </ProductContainer>
                :
                <div className={"place-holder"}> Load data...</div>}
            <AddButton onSubmit={onSubmit} onChange={onChange}/>
            <Footer/>
            </>
    )


}

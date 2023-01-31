import ProductContainer from "./ProductContainer";
import ProductCard from "./ProductCard";
import useShoppingCart from "../hooks/useShoppingCart";
import {removeFromShoppingCart} from "../api/ProductApi";

export default function ShoppingCard(){
    const [shoppingCart,setShoppingCards] = useShoppingCart();
    const onRemove = (id: string) => {
        const theNewShoppingCard = shoppingCart.filter(f => f.id !== id)
        removeFromShoppingCart(id);
        setShoppingCards([...theNewShoppingCard])
    }




    return (
        <>
            <ProductContainer >
                {shoppingCart.map(p => <div key={p.id} className={"product-card"}><ProductCard  children={
                    <>
                    {/*REMOVE BUTTON*/}
                    <button type="button" className="btn  p-1 shopping-cart-remove-button" onClick={()=> {onRemove(p.id)}}>Entfernen</button>
                    </>
                } product={p}/>


                </div>)}

            </ProductContainer>
        </>
    )
}
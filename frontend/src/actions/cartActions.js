import axios from 'axios'
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
  CART_LOAD_FROM_BACKEND,
} from '../constants/cartConstants'

export const addToCart = (id, qty) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/products/${id}`)

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      qty,
    },
  })

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
  dispatch(syncCartToBackend())
}

export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  })

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
  dispatch(syncCartToBackend())
}

export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  })

  localStorage.setItem('shippingAddress', JSON.stringify(data))
}

export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  })

  localStorage.setItem('paymentMethod', JSON.stringify(data))
}



export const syncCartToBackend = () => async (dispatch, getState) => {
  const {
    cart: { cartItems },
    userLogin: { userInfo },
  } = getState()
  console.log('userInfo.token:', userInfo?.token)
  if (!userInfo) return

  try {
    await axios.put(
        '/api/users/cart',
        { cartItems },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
    )
  } catch (error) {
    console.error('Failed to sync cart to backend:', error)
  }
}

export const loadCartFromBackend = () => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState()
  console.log('userInfo.token:', userInfo?.token)
  if (!userInfo) return

  try {
    const { data } = await axios.get('/api/users/cart', {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    })

    dispatch({
      type: CART_LOAD_FROM_BACKEND,
      payload: data,
    })

    localStorage.setItem('cartItems', JSON.stringify(data))
  } catch (error) {
    console.error('Failed to load cart from backend:', error)
  }
}

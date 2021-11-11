import { Action } from "@ngrx/store";
import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";


export interface State {
    ingredients: Ingredient[],
    editedIngredient: Ingredient,
    editedIngredientIndex: number
}

export interface AppState{
    shoppingList: State;
}


const initialState:State = {
    ingredients:  [
        new Ingredient('Apple', 15),
        new Ingredient('Tomato', 5)
      ],
    editedIngredient: null,
    editedIngredientIndex: -1
}



export function shoppingListReducer(
        state:State = initialState, 
        action: ShoppingListActions.ShoppingListActions ){
    switch (action.type) {
        case ShoppingListActions.ADD_INGREDIENT:
            return {
                ...state,
                ingredients:[...state.ingredients, action.payload] 
            };

        case ShoppingListActions.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients:[...state.ingredients, ...action.payload] 
            };
        case ShoppingListActions.UPDATE_INGREDIENT:
            //Get old ingredient with index of payload
            const ingredient = state.ingredients[state.editedIngredientIndex];

            //Update ingredient with new properties
            const updatedIngredient = {
                ...ingredient,
                ...action.payload
            }

            //Get list of ingredient
            const updatedIngredients = [...state.ingredients];

            //Set new ingredient for updated list ingredient
            updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

            return{
                ...state,
                ingredients: updatedIngredients,
                editedIngredient: null,
                editedIngredientIndex: -1

            };
        case ShoppingListActions.DELETE_INGREDIENT:

            
            return {
                ...state,
                ingredients: state.ingredients.filter((ingredient, index) => {
                    return index !== state.editedIngredientIndex;
                }),
                editedIngredient: null,
                editedIngredientIndex: -1
            }
        
        case ShoppingListActions.START_EDIT:
            return {
                ...state,
                editedIngredientIndex: action.payload,
                editedIngredient: {...state.ingredients[action.payload]} //Copy object
                
            };
        
        case ShoppingListActions.STOP_EDIT:
            return{
                ...state,
                editedIngredientIndex: null,
                editedIngredient: -1
            };
        default:
            return state;
    }
}
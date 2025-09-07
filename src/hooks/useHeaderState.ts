import { useReducer } from 'react';

export type HeaderState = {
  isMenuOpen: boolean;
  isThemeOpen: boolean;
};

export type HeaderAction = 
  | { type: 'TOGGLE_MENU' }
  | { type: 'TOGGLE_THEME' }
  | { type: 'CLOSE_MENU' }
  | { type: 'CLOSE_THEME' }
  | { type: 'CLOSE_ALL' };

const initialState: HeaderState = {
  isMenuOpen: false,
  isThemeOpen: false,
};

function headerReducer(state: HeaderState, action: HeaderAction): HeaderState {
  switch (action.type) {
    case 'TOGGLE_MENU':
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen,
        isThemeOpen: false, // Close theme when opening menu
      };
    case 'TOGGLE_THEME':
      return {
        ...state,
        isThemeOpen: !state.isThemeOpen,
        isMenuOpen: false, // Close menu when opening theme
      };
    case 'CLOSE_MENU':
      return {
        ...state,
        isMenuOpen: false,
      };
    case 'CLOSE_THEME':
      return {
        ...state,
        isThemeOpen: false,
      };
    case 'CLOSE_ALL':
      return {
        isMenuOpen: false,
        isThemeOpen: false,
      };
    default:
      return state;
  }
}

export function useHeaderState() {
  const [state, dispatch] = useReducer(headerReducer, initialState);

  const toggleMenu = () => dispatch({ type: 'TOGGLE_MENU' });
  const toggleTheme = () => dispatch({ type: 'TOGGLE_THEME' });
  const closeMenu = () => dispatch({ type: 'CLOSE_MENU' });
  const closeTheme = () => dispatch({ type: 'CLOSE_THEME' });
  const closeAll = () => dispatch({ type: 'CLOSE_ALL' });

  return {
    state,
    actions: {
      toggleMenu,
      toggleTheme,
      closeMenu,
      closeTheme,
      closeAll,
    },
  };
}

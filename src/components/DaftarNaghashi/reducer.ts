import {Mode} from './types.ts';

interface DrawingState {
    isDrawing: boolean;
    strokeColor: string;
    lineWidth: number;
    history: string[];
    mode: Mode;
}

type DrawingAction =
    | { type: 'START_DRAWING' }
    | { type: 'STOP_DRAWING' }
    | { type: 'SET_COLOR'; payload: string }
    | { type: 'SET_LINE_WIDTH'; payload: number }
    | { type: 'SAVE_HISTORY'; payload: string }
    | { type: 'UNDO' }
    | { type: 'CLEAR_CANVAS' }
    | { type: 'SET_MODE'; payload: Mode };

const drawingReducer = (state: DrawingState, action: DrawingAction): DrawingState => {
    switch (action.type) {
        case 'START_DRAWING':
            return { ...state, isDrawing: true };
        case 'STOP_DRAWING':
            return { ...state, isDrawing: false };
        case 'SET_COLOR':
            return { ...state, strokeColor: action.payload };
        case 'SET_LINE_WIDTH':
            return { ...state, lineWidth: action.payload };
        case 'SAVE_HISTORY':
            return { ...state, history: [...state.history, action.payload] };
        case 'UNDO':
            if (state.history.length > 1) {
                return { ...state, history: state.history.slice(0, -1) };
            }
            return state;
        case 'CLEAR_CANVAS':
            return { ...state, history: [] };
        case 'SET_MODE':
            return { ...state, mode: action.payload };
        default:
            return state;
    }
};

export default drawingReducer;
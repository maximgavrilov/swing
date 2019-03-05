declare module 'swing' {
    export const Direction: {
        DOWN: symbol;
        INVALID: symbol;
        LEFT: symbol;
        RIGHT: symbol;
        UP: symbol;
    };

    interface Event {
        target: HTMLElement;
    };

    interface DirectedEvent implements Event {
        throwDirection: Direction;
    };

    interface DragMoveEvent implements DirectedEvent {
        offset: number;
        throwOutConfidence: number;
    };

    export class Stack {
        constructor(config?: Partial<Config>);

        /**
         * Get the configuration object.
         *
         * @returns {Object}
         */
        getConfig(): Config;

        /**
         * Get a singleton instance of the SpringSystem physics engine.
         *
         * @returns {Sister}
         */
        getSpringSystem(): any;

        /**
         * Proxy to the instance of the event emitter.
         *
         * @param {string} eventName
         * @param {string} listener
         * @returns {undefined}
         */
        on(eventName: 'destroyCard', listener: (card: Card) => void): void;
        on(eventName: 'dragend', listener: (e: Event) => void): void;
        on(eventName: 'dragmove', listener: (e: DragMoveEvent) => void): void;
        on(eventName: 'dragstart', listener: (e: Event) => void): void;
        on(eventName: 'throwin', listener: (e: DirectedEvent) => void): void;
        on(eventName: 'throwout', listener: (e: DirectedEvent) => void): void;
        on(eventName: 'throwoutdown', listener: (e: DirectedEvent) => void): void;
        on(eventName: 'throwoutend', listener: (e: Event) => void): void;
        on(eventName: 'throwoutleft', listener: (e: DirectedEvent) => void): void;
        on(eventName: 'throwoutright', listener: (e: DirectedEvent) => void): void;
        on(eventName: 'throwoutup', listener: (e: DirectedEvent) => void): void;
        on(eventName: string, listener: (e: any) => void): void;

        /**
         * Creates an instance of Card and associates it with an element.
         *
         * @param {HTMLElement} element
         * @param {boolean} prepend
         * @returns {Card}
         */
        createCard(element: HTMLElement, prepend?: boolean): Card;

        /**
         * Returns an instance of Card associated with an element.
         *
         * @param {HTMLElement} element
         * @returns {Card|null}
         */
        getCard(element: HTMLElement): Card | null;

        /**
         * Remove an instance of Card from the stack index.
         *
         * @param {Card} card
         * @returns {null}
         */
        destroyCard(card: Card): null
    }

    interface Card {

        /**
         * Creates a configuration object.
         *
         * @param {Object} config
         * @returns {Object}
         */
        makeConfig(config: Config): Config;

        /**
         * Uses CSS transform to translate element position and rotation.
         *
         * Invoked in the event of `dragmove` and every time the physics solver is triggered.
         *
         * @param {HTMLElement} element
         * @param {number} coordinateX Horizontal offset from the startDrag.
         * @param {number} coordinateY Vertical offset from the startDrag.
         * @param {number} rotation
         * @returns {undefined}
         */
        transform(element: HTMLElement, coordinateX: number, coordinateY: number, rotation: number): undefined

        /**
         * Append element to the parentNode.
         *
         * This makes the element first among the siblings. The reason for using
         * this as opposed to zIndex is to allow CSS selector :nth-child.
         *
         * Invoked in the event of mousedown.
         * Invoked when card is added to the stack.
         *
         * @param {HTMLElement} element The target element.
         * @returns {undefined}
         */
        appendToParent(element: HTMLElement): undefined;

        /**
         * Prepend element to the parentNode.
         *
         * This makes the element last among the siblings.
         *
         * Invoked when card is added to the stack (when prepend is true).
         *
         * @param {HTMLElement} element The target element.
         * @return {undefined}
         */
        prependToParent(element: HTMLElement): undefined;

        /**
         * Returns a value between 0 and 1 indicating the completeness of the throw out condition.
         *
         * Ration of the absolute distance from the original card position and element width.
         *
         * @param {number} xOffset Distance from the dragStart.
         * @param {number} yOffset Distance from the dragStart.
         * @param {HTMLElement} element Element.
         * @returns {number}
         */
        throwOutConfidence(xOffset: number, yOffset: number, element: HTMLElement): number;

        /**
         * Determines if element is being thrown out of the stack.
         *
         * Element is considered to be thrown out when throwOutConfidence is equal to 1.
         *
         * @param {number} xOffset Distance from the dragStart.
         * @param {number} yOffset Distance from the dragStart.
         * @param {HTMLElement} element Element.
         * @param {number} throwOutConfidence config.throwOutConfidence
         * @returns {boolean}
         */
        isThrowOut(xOffset: number, yOffset: number, element: HTMLElement, throwOutConfidence: number): boolean;

        /**
         * Calculates a distances at which the card is thrown out of the stack.
         *
         * @param {number} min
         * @param {number} max
         * @returns {number}
         */
        throwOutDistance(min: number, max: number): number;

        /**
         * Calculates rotation based on the element x and y offset, element width and maxRotation variables.
         *
         * @param {number} coordinateX Horizontal offset from the startDrag.
         * @param {number} coordinateY Vertical offset from the startDrag.
         * @param {HTMLElement} element Element.
         * @param {number} maxRotation
         * @returns {number} Rotation angle expressed in degrees.
         */
        rotation(coordinateX: number, coordinateY: number, element: HTMLElement, maxRotation: number): number;

        throwIn(coordinateX: number, coordinateY: number, direction: Direction): void;
        throwOut(coordinateX: number, coordinateY: number, direction: Direction): void;
        destroy(): void;
    }

    interface Config {
        allowedDirections: Direction[],
        isThrowOut: Card['isThrowOut'],
        maxRotation: number,
        maxThrowOutDistance: number,
        minThrowOutDistance: number,
        rotation: Card['rotation'],
        throwOutConfidence: Card['throwOutConfidence'],
        throwOutDistance: Card['throwOutDistance'],
        transform: Card['transform'],
    }
}

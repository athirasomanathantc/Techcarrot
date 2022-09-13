export class Common {
    constructor() {

    }

    public generateCarouselArray = (items: any, itemCount: number) => {
        let itemCarousel = [];
        let itemColl = [];
        for (let i = 0; i < items.length; i += itemCount) {
            itemColl = [];
            for (let j = 0; j < itemCount; j++) {
                if (items[i + j]) {
                    itemColl.push(items[i + j]);
                }
            }
            if (itemColl.length) {
                itemCarousel.push(itemColl);
            }
        }
        return itemCarousel;
    }
}

export default Common;
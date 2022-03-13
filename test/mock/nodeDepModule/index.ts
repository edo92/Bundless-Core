import Uuid from 'short-unique-id';

class Util {
    static uuid(len?: number): string {
        return new Uuid({ length: len || 10 })();
    }
}

export default Util;

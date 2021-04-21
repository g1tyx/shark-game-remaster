/* eslint-disable no-control-regex */
/*
 JavaScript Base64 and Ascii85 encoder/decoder, by Jacob Rus.

 --------------------

 Copyright (c) 2009 Jacob Rus

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * @param {any[]} array - the array to shorten
 * @param {number} number - the amount to shorten it by
 * @desc remove 'number' characters from the end of 'array'
 */
function shorten(array, number) {
    while (number-- > 0) {
        array.pop();
    }
}

function assertOrBadInput(expression, message) {
    if (!expression) {
        throw new ascii85.Ascii85CodecError(message);
    }
}

window.ascii85 = new (class ascii85 {
    Ascii85CodecError = class Ascii85CodecError extends Error {
        constructor(message) {
            super(message);
        }

        toString() {
            return "Ascii85CodecError" + (this.message ? ": " + this.message : "");
        }
    };
    encode(bytes) {
        assertOrBadInput(!/[^\x00-\xFF]/.test(bytes), "Input contains out-of-range characters."); // disallow two-byte chars
        const padding = "\x00\x00\x00\x00".slice(bytes.length % 4 || 4);
        bytes += padding; // pad with null bytes
        const out_array = [];
        for (let i = 0, n = bytes.length; i < n; i += 4) {
            let newchars =
                ((bytes.charCodeAt(i) << (3 * 8)) +
                    (bytes.charCodeAt(i + 1) << (2 * 8)) +
                    (bytes.charCodeAt(i + 2) << (1 * 8)) +
                    bytes.charCodeAt(i + 3)) >>>
                0;
            if (newchars === 0) {
                out_array.push(0x7a); // special case: 4 null bytes -> 'z'
                continue;
            }
            const char5 = newchars % 85;
            newchars = (newchars - char5) / 85;
            const char4 = newchars % 85;
            newchars = (newchars - char4) / 85;
            const char3 = newchars % 85;
            newchars = (newchars - char3) / 85;
            const char2 = newchars % 85;
            newchars = (newchars - char2) / 85;
            const char1 = newchars % 85;
            out_array.push(char1 + 0x21, char2 + 0x21, char3 + 0x21, char4 + 0x21, char5 + 0x21);
        }
        shorten(out_array, padding.length);
        return "<~" + String.fromCharCode.apply(String, out_array) + "~>";
    }
    decode(a85text) {
        assertOrBadInput(a85text.slice(0, 2) === "<~" && a85text.slice(-2) === "~>", "Invalid initial/final ascii85 characters");
        // kill whitespace, handle special 'z' case
        a85text = a85text.slice(2, -2).replace(/\s/g, "").replace("z", "!!!!!");
        assertOrBadInput(!/[^\x21-\x75]/.test(a85text), "Input contains out-of-range characters.");
        const padding = "\x75\x75\x75\x75\x75".slice(a85text.length % 5 || 5);
        a85text += padding; // pad with 'u'
        let newchars;
        const out_array = [];
        const pow1 = 85;
        const pow2 = pow1 * 85;
        const pow3 = pow2 * 85;
        const pow4 = pow3 * 85;
        for (let i = 0, n = a85text.length; i < n; i += 5) {
            newchars =
                (a85text.charCodeAt(i) - 0x21) * pow4 +
                (a85text.charCodeAt(i + 1) - 0x21) * pow3 +
                (a85text.charCodeAt(i + 2) - 0x21) * pow2 +
                (a85text.charCodeAt(i + 3) - 0x21) * pow1 +
                (a85text.charCodeAt(i + 4) - 0x21);
            out_array.push((newchars >> (3 * 8)) & 0xff, (newchars >> (2 * 8)) & 0xff, (newchars >> (1 * 8)) & 0xff, newchars & 0xff);
        }
        shorten(out_array, padding.length);
        return String.fromCharCode.apply(String, out_array);
    }
})();

// var hobbes = (
//   'Man is distinguished, not only by his reason, but by this ' +
//   'singular passion from other animals, which is a lust of the mind, that ' +
//   'by a perseverance of delight in the continued and indefatigable ' +
//   'generation of knowledge, exceeds the short vehemence of any carnal ' +
//   'pleasure.'
// );
// var a85testencode = ascii85.encode(hobbes);
// var a85testdecode = ascii85.decode(a85testencode);
// console.log('Original:\n' + hobbes);
// console.log('Ascii85:\n' + a85testencode);
// console.log('Decoded:\n' + a85testdecode);
// console.log('Decoded:\n' + b64testdecode);
// console.log('Decoded:\n' + b64utestdecode);

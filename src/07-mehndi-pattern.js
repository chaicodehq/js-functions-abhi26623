/**
 * 🎨 Mehndi Pattern Maker - Recursion
 *
 * Mehndi artist hai tu! Intricate patterns banane hain using RECURSION.
 * Yahan loops use karna MANA hai — sirf function khud ko call karega
 * (recursive calls). Har function mein base case aur recursive case hoga.
 *
 * Functions:
 *
 *   1. repeatChar(char, n)
 *      - Repeat char n times using recursion (NO loops, NO .repeat())
 *      - Base case: n <= 0 => return ""
 *      - Recursive: char + repeatChar(char, n - 1)
 *      - Agar char not a string or empty, return ""
 *
 *   2. sumNestedArray(arr)
 *      - Sum all numbers in an arbitrarily nested array
 *      - e.g., [1, [2, [3, 4]], 5] => 15
 *      - Skip non-number values
 *      - Base case: empty array => 0
 *      - Agar input not array, return 0
 *
 *   3. flattenArray(arr)
 *      - Flatten an arbitrarily nested array into a single flat array
 *      - e.g., [1, [2, [3, 4]], 5] => [1, 2, 3, 4, 5]
 *      - Agar input not array, return []
 *
 *   4. isPalindrome(str)
 *      - Check if string is palindrome using recursion
 *      - Case-insensitive comparison
 *      - Base case: string length <= 1 => true
 *      - Compare first and last chars, recurse on middle
 *      - Agar input not string, return false
 *
 *   5. generatePattern(n)
 *      - Generate symmetric mehndi border pattern
 *      - n = 1 => ["*"]
 *      - n = 2 => ["*", "**", "*"]
 *      - n = 3 => ["*", "**", "***", "**", "*"]
 *      - Pattern goes from 1 star up to n stars, then back down to 1
 *      - Use recursion to build the ascending part, then mirror it
 *      - Agar n <= 0, return []
 *      - Agar n is not a positive integer, return []
 *
 * Hint: Every recursive function needs a BASE CASE (when to stop) and a
 *   RECURSIVE CASE (calling itself with a smaller/simpler input).
 *
 * @example
 *   repeatChar("*", 4)        // => "****"
 *   sumNestedArray([1, [2, [3]]]) // => 6
 *   flattenArray([1, [2, [3]]]) // => [1, 2, 3]
 *   isPalindrome("madam")     // => true
 *   generatePattern(3)        // => ["*", "**", "***", "**", "*"]
 */
export function repeatChar(char, n) {
  if (typeof char !== 'string' || char === '') return '';
  if (n <= 0) return '';
  return char + repeatChar(char, n - 1);
}

export function sumNestedArray(arr) {
  if (!Array.isArray(arr)) return 0;
  if (arr.length === 0) return 0;
  
  const first = arr[0];
  const rest = arr.slice(1);
  
  if (Array.isArray(first)) {
    return sumNestedArray(first) + sumNestedArray(rest);
  } else if (typeof first === 'number') {
    return first + sumNestedArray(rest);
  } else {
    return sumNestedArray(rest);
  }
}

export function flattenArray(arr) {
  if (!Array.isArray(arr)) return [];
  if (arr.length === 0) return [];
  
  const first = arr[0];
  const rest = arr.slice(1);
  
  if (Array.isArray(first)) {
    return [...flattenArray(first), ...flattenArray(rest)];
  } else {
    return [first, ...flattenArray(rest)];
  }
}

export function isPalindrome(str) {
  if (typeof str !== 'string') return false;
  if (str.length <= 1) return true;
  
  const lowerStr = str.toLowerCase();
  
  if (lowerStr[0] !== lowerStr[lowerStr.length - 1]) {
    return false;
  }
  
  // Recurse on middle
  return isPalindrome(str.slice(1, -1));
}

export function generatePattern(n) {
  if (typeof n !== 'number' || n <= 0 || !Number.isInteger(n)) return [];
  
  if (n === 1) return ["*"];
  
  const prevPattern = generatePattern(n - 1);
  const stars = repeatChar("*", n);
  
  // The pattern goes:
  // n=1: [*]
  // n=2: [*, **, *]  -> prev + stars + prev? No, that would be *, **, *
  // Wait, let's see:
  // prevPattern for n=1 is ["*"]
  // for n=2 we want ["*", "**", "*"]. If we do [...prevPattern, stars, ...prevPattern], it will be ["*", "**", "*"]. That works!
  // for n=3 we want ["*", "**", "***", "**", "*"].
  // prevPattern for n=2 is ["*", "**", "*"]
  // If we do [...prevPattern, stars, ...prevPattern] for n=3, it will be:
  // ["*", "**", "*", "***", "*", "**", "*"] -> wait, this has 7 elements!
  // But the test for n=3 wants: ["*", "**", "***", "**", "*"]
  // Ah! The test output is:
  // n=1: ["*"]
  // n=2: ["*", "**", "*"]
  // n=3: ["*", "**", "***", "**", "*"]
  // This is just mapping 1 to n to 1.
  // We can build it recursively.
  // The first half is the array ["*", "**", ... up to n-1 stars]
  // Then n stars
  // then the second half is the same as the first half reversed (or just the same since it's symmetric)
  // Let's look at prevPattern again.
  // prevPattern is the FULL pattern for n-1.
  // For n=3, prevPattern was ["*", "**", "*"]
  // The first half of that is ["*"]
  // So maybe we can extract the first half, append n stars, then append second half.
  // For n=2, prevPattern is ["*"], middle is 0.
  // Actually, we can just take the first n-1 elements of prevPattern!
  // Wait, for n=3, prevPattern has 3 elements. The first 2 elements are ["*", "**"]? No, prevPattern is ["*", "**", "*"].
  // We want the part that increases.
  // Actually, a simpler way: just generate the increasing part from 1 to n, then append the decreasing part.
  // But the prompt says: "Use recursion to build the ascending part, then mirror it"
  // Is generatePattern supposed to just return the whole thing? "Pattern goes from 1 star up to n stars, then back down to 1"
  // If we just need to return the array, maybe we don't need to recursively call generatePattern(n-1) to build the whole array, but to build something else?
  // Let's just build it recursively.
  // If we define a helper function? "NO loops, NO .repeat() - sirf function khud ko call karega"
  // Wait, we can construct the array by building it from generatePattern n-1.
  // If we take generatePattern(n-1), which is ["*", "**", "*"] for n=2.
  // The new array is: the first half of the new array is the first half of prevPattern + the middle of prevPattern.
  // Wait.
  // n=1 -> ["*"]
  // n=2 -> ["*", "**", "*"]
  // n=3 -> ["*", "**", "***", "**", "*"]
  // Observe that elements are stars of length 1, 2, ..., n, ..., 2, 1.
  // If we have n=3, the elements are [stars(1), stars(2), stars(3), stars(2), stars(1)].
  // Can we just slice prevPattern exactly in half?
  // prevPattern for n=3 is length 5. middle element is index 2.
  // If we want n=4, prevPattern is ["*", "**", "***", "**", "*"].
  // We take the first 3 elements: ["*", "**", "***"], append "****", then the last 3 elements, wait no, the last 3 elements of what?
  // Just the first n-1 elements of prevPattern!
  // For n=2: first 1 element of prevPattern ["*"] -> ["*"], append "**", append ["*"].
  // For n=3: first 2 elements of prevPattern ["*", "**"] -> ["*", "**"], append "***", append ["**", "*"].
  // This means the array is:
  // first = prevPattern.slice(0, n - 1)
  // middle = repeatChar("*", n)
  // last = prevPattern.slice(-(n - 1))
  // Let's test this:
  // n=2: prev is ["*"]. first is prev.slice(0, 1) = ["*"]. last is prev.slice(-1) = ["*"]. middle = "**". Result = ["*", "**", "*"]. Correct.
  // n=3: prev is ["*", "**", "*"]. first is prev.slice(0, 2) = ["*", "**"]. last is prev.slice(-2) = ["**", "*"]. middle = "***". Result = ["*", "**", "***", "**", "*"]. Correct!
  // n=4: prev is... first is prev.slice(0, 3), middle is 4 stars, last is prev.slice(-3). Correct!
  
  const firstHalf = prevPattern.slice(0, n - 1);
  const secondHalf = prevPattern.slice(-(n - 1));
  
  return [
    ...firstHalf,
    stars,
    ...secondHalf
  ];
}

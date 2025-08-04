import HexagramManifest from "_lib/data/iching_wilhelm_translation";
import Server from "next/server";

const getSubtotal = (allStalks: number[]) => {
    let secondStalk: number = -1;
    let leftStalks: number[] = [];
    let rightStalks: number[] = [];

    //split into left and right
    let splitPoint = Math.floor(Math.random() * 20 + 15);
    allStalks.forEach((s, i) => {
        if (s < splitPoint) leftStalks.push(s);
        if (s >= splitPoint) rightStalks.push(s);
    });

    //select second stalk
    secondStalk = rightStalks[Math.floor(Math.random() * rightStalks.length)];
    rightStalks = rightStalks.filter(s => s !== secondStalk);

    let tabledLeftStalks: number[] = [];
    let tabledRightStalks: number[] = [];

    //filter left stalks
    while (leftStalks.length > 4) {
        tabledLeftStalks.push(leftStalks.pop() as number);
        tabledLeftStalks.push(leftStalks.pop() as number);
        tabledLeftStalks.push(leftStalks.pop() as number);
        tabledLeftStalks.push(leftStalks.pop() as number);
    }

    //filter right stalks
    while (rightStalks.length > 4) {
        tabledRightStalks.push(rightStalks.pop() as number);
        tabledRightStalks.push(rightStalks.pop() as number);
        tabledRightStalks.push(rightStalks.pop() as number);
        tabledRightStalks.push(rightStalks.pop() as number);
    }

    const total = 1 + leftStalks.length + rightStalks.length;
    console.log({ total, leftLength: leftStalks.length, rightLength: rightStalks.length });
    return {
        total,
        stalks: [...tabledLeftStalks, ...tabledRightStalks],
    };
};

const getLine = (allStalks: number[]) => {
    const { total: firstTotal, stalks: firstStalks } = getSubtotal([...allStalks]);
    const { total: secondTotal, stalks: secondStalks } = getSubtotal([...firstStalks]);
    const { total: thirdTotal, stalks: thirdStalks } = getSubtotal([...secondStalks]);

    const finalTotal =
        (firstTotal > 6 ? 2 : 3) + (secondTotal > 6 ? 2 : 3) + (thirdTotal > 6 ? 2 : 3);
    return finalTotal;
};

export const revalidate = 0;

export const GET = async () => {
    let allStalks: number[] = Array.from({ length: 50 }, (_, i) => i);
    allStalks.sort((a, b) => Math.random() - 0.5);

    //select observer stalk
    const observerStalk = allStalks.pop() as number;

    const line1 = getLine([...allStalks]);
    allStalks.sort((a, b) => Math.random() - 0.5);
    const line2 = getLine([...allStalks]);
    allStalks.sort((a, b) => Math.random() - 0.5);
    const line3 = getLine([...allStalks]);
    allStalks.sort((a, b) => Math.random() - 0.5);
    const line4 = getLine([...allStalks]);
    allStalks.sort((a, b) => Math.random() - 0.5);
    const line5 = getLine([...allStalks]);
    allStalks.sort((a, b) => Math.random() - 0.5);
    const line6 = getLine([...allStalks]);

    const hexagram = [line1, line2, line3, line4, line5, line6];
    const hexagramLines = hexagram.map(l => (l % 2 === 0 ? "8" : "7")).join("");
    const fullHexagram = Object.values(HexagramManifest).find(h => h.lines === hexagramLines);
    return Server.NextResponse.json({ hexagram, hexagramLines, fullHexagram });
};

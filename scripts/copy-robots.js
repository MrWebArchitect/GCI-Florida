import fs from "fs";
import path from "path";

const source = path.resolve("./robots.txt");
const destination = path.resolve('./dist/robots.txt');

//Make sure dist exists before copying 
if (!fs.existsSync("./dist")) {
    fs.mkdirSync("./dist", { recursive: true });
}

fs.copyFile(source, destination, (err) => {
    if (err) {
        console.error("❌ Failed to copy robots.txt:", err);
    } else {
        console.log("✅ robots.txt copied to dist/");
    }
});
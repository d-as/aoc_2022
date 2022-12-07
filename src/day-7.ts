import { getInputLines } from './util';

// Enums

enum Command {
  CHANGE_DIRECTORY = 'cd',
  LIST = 'ls',
}

enum Directory {
  ROOT = '/',
  PARENT = '..',
}

enum FileSystemNodeType {
  FILE = 'file',
  DIRECTORY = 'directory',
}

// Interfaces

interface FileSystemNode {
  type: FileSystemNodeType
  name: string
}

interface DirectoryNode extends FileSystemNode {
  parent?: DirectoryNode
  children: FileSystemNode[]
}

interface FileNode extends FileSystemNode {
  size: number
}

// Regex patterns

const COMMAND_REGEX = new RegExp(
  `^\\$ (${Command.CHANGE_DIRECTORY}|${Command.LIST})(?: (${Directory.ROOT}|${Directory.PARENT}|[a-z]+))?$`
);

const FILE_REGEX = /^(\d+) ([a-z]+(?:\.[a-z]+)?)$/;

// Helper functions

const createDirectory = (name: string, parent?: DirectoryNode): DirectoryNode => ({
  type: FileSystemNodeType.DIRECTORY,
  name,
  parent,
  children: [],
});

const createFile = (name: string, size: number): FileNode => ({
  type: FileSystemNodeType.FILE,
  name,
  size,
});

const getChild = (type: FileSystemNodeType, directory: DirectoryNode, name: string): FileSystemNode | undefined => (
  directory.children.find(child => child.type === type && child.name === name)
);

const getChildren = (type: FileSystemNodeType, directory: DirectoryNode): FileSystemNode[] => (
  directory.children.filter(child => child.type === type)
);

const getDirectory = (directory: DirectoryNode, name: string): DirectoryNode | undefined => (
  getChild(FileSystemNodeType.DIRECTORY, directory, name) as DirectoryNode
);

const getDirectories = (directory: DirectoryNode): DirectoryNode[] => (
  getChildren(FileSystemNodeType.DIRECTORY, directory) as DirectoryNode[]
);

const getAllDirectories = (directory: DirectoryNode): DirectoryNode[] => {
  const directories = getDirectories(directory);
  return [...directories, ...directories.flatMap(getAllDirectories)];
};

const getFile = (directory: DirectoryNode, name: string): FileNode | undefined => (
  getChild(FileSystemNodeType.FILE, directory, name) as FileNode
);

const getFiles = (directory: DirectoryNode): FileNode[] => (
  getChildren(FileSystemNodeType.FILE, directory) as FileNode[]
);

// Implementation

const parseFileSystem = (input: string[]): DirectoryNode => {
  const rootDirectory = createDirectory(Directory.ROOT);
  let currentDirectory = rootDirectory;

  input.forEach(line => {
    if (COMMAND_REGEX.test(line)) {
      const [, command, argument] = line.match(COMMAND_REGEX) as RegExpMatchArray;

      if (command === Command.CHANGE_DIRECTORY) {
        if (argument === Directory.ROOT) {
          currentDirectory = rootDirectory;
        } else if (argument === Directory.PARENT) {
          currentDirectory = currentDirectory.parent ?? currentDirectory;
        } else {
          const name = argument;
          let directory = getDirectory(currentDirectory, name);

          if (!directory) {
            directory = createDirectory(name, currentDirectory);
            currentDirectory.children.push(directory);
          }
          currentDirectory = directory;
        }
      }
    } else if (FILE_REGEX.test(line)) {
      const [, size, name] = line.match(FILE_REGEX) as RegExpMatchArray;

      if (!getFile(currentDirectory, name)) {
        currentDirectory.children.push(createFile(name, Number(size)));
      }
    }
  });

  return rootDirectory;
};

const getDirectorySize = (directory: DirectoryNode): number => (
  getFiles(directory).reduce((size, file) => size + file.size, 0) +
  getDirectories(directory).reduce((size, child) => size + getDirectorySize(child), 0)
);

const rootDirectory = parseFileSystem(getInputLines(__filename));
const allDirectories = getAllDirectories(rootDirectory);

console.log('Total size of directories:', allDirectories.reduce((size, directory) => {
  const directorySize = getDirectorySize(directory);
  return size + (directorySize <= 100_000 ? directorySize : 0);
}, 0));

const availableSpace = 70_000_000;
const requiredUnusedSpace = 30_000_000;
const totalUsedSpace = getDirectorySize(rootDirectory);
const requiredFreedSpace = requiredUnusedSpace - availableSpace + totalUsedSpace;

const [smallestSize] = allDirectories
  .map(getDirectorySize)
  .filter(size => size >= requiredFreedSpace)
  .sort((a, b) => a - b);

console.log('Total size of directory:', smallestSize);

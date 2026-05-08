export interface GitHubRepo {
  owner: {
    login: string;
  };
  name: string;
  default_branch: string;
}

export interface GitHubTreeItem {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
  url: string;
}

export interface GitHubTree {
  sha: string;
  url: string;
  tree: GitHubTreeItem[];
  truncated: boolean;
}

export interface GitHubBlob {
  content: string;
  encoding: string;
  url: string;
  sha: string;
  size: number;
}

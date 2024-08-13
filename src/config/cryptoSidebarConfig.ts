import type { Section } from "@/env";

export const sections: Section[] = [
  {
    name: "Symmetric Ciphers",
    path: "",
    children: [
      {
        path: "/cryptography/caesar",
        name: "Caesar Cipher",
        children: [
          { path: "/cryptography/caesar#description", name: "Description" },
          { path: "/cryptography/caesar#source-code", name: "Source code" },
          { path: "/cryptography/caesar/playground", name: "Playground" },
        ],
      },
      {
        path: "/cryptography/vigenere",
        name: "Vigenère Cipher",
      },
      {
        path: "/cryptography/affine",
        name: "Affine Cipher",
      },
      {
        path: "/cryptography/hill",
        name: "Hill Cipher",
      },
      {
        path: "/cryptography/substitution",
        name: "Substitution Cipher",
      },
    ],
  },
  {
    name: "Asymmetric Ciphers",
    path: "",
    children: [
      {
        path: "/cryptography/rsa",
        name: "RSA",
        children: [
          { path: "/cryptography/rsa#description", name: "Description" },
          { path: "/cryptography/rsa#source-code", name: "Source code" },
          { path: "/cryptography/rsa/playground", name: "Playground" },
        ],
      },
      {
        path: "/cryptography/elgamal",
        name: "ElGamal",
      },
      {
        path: "/cryptography/diffie-hellman",
        name: "Diffie-Hellman",
      },
      {
        path: "/cryptography/elliptic-curve",
        name: "Elliptic Curve Cryptography (ECC)",
        children: [
          { path: "/cryptography/elliptic-curve#description", name: "Description" },
          { path: "/cryptography/elliptic-curve#source-code", name: "Source code" },
          { path: "/cryptography/elliptic-curve/playground", name: "Playground" },
        ],
      },
      {
        path: "/cryptography/dsa",
        name: "Digital Signature Algorithm (DSA)",
      },
      {
        path: "/cryptography/paillier",
        name: "Paillier Cryptosystem",
      },
      {
        path: "/cryptography/rabin",
        name: "Rabin Cryptosystem",
      },
    ],
  },
];
